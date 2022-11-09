import sys
from awsglue.transforms import *
from awsglue.utils import getResolvedOptions
from pyspark.context import SparkContext
from awsglue.context import GlueContext
from awsglue.job import Job

args = getResolvedOptions(sys.argv, ["JOB_NAME", "GLUE_DATABASE", "GLUE_USER_TABLE", "GLUE_PRODUCT_TABLE", "ETL_OUTPUT_PATH"])
sc = SparkContext()
glueContext = GlueContext(sc)
spark = glueContext.spark_session
job = Job(glueContext)

JOB_NAME=args['JOB_NAME']
GLUE_DATABASE = args['GLUE_DATABASE']
GLUE_USER_TABLE = args['GLUE_USER_TABLE']
GLUE_PRODUCT_TABLE = args['GLUE_PRODUCT_TABLE']
ETL_OUTPUT_PATH = args['ETL_OUTPUT_PATH']

job.init(JOB_NAME, args)

# Script generated for node AWS Glue Data Catalog
dfUser = glueContext.create_dynamic_frame.from_catalog(
    database=GLUE_DATABASE,
    table_name=GLUE_USER_TABLE,
    transformation_ctx="dfUser",
)

dfProduct = glueContext.create_dynamic_frame.from_catalog(
    database=GLUE_DATABASE,
    table_name=GLUE_PRODUCT_TABLE,
    transformation_ctx="dfProduct",
)

# Script generated for node Renamed keys for Join
# RenamedkeysforJoin_node1667902822831 = ApplyMapping.apply(
#     frame=AWSGlueDataCatalog_node1667902742457,
#     mappings=[
#         ("createdat", "long", "`(right) createdat`", "long"),
#         ("name", "string", "`(right) name`", "string"),
#         ("userid", "string", "`(right) userid`", "string"),
#         ("updatedat", "long", "`(right) updatedat`", "long"),
#     ],
#     transformation_ctx="RenamedkeysforJoin_node1667902822831",
# )

# Script generated for node Join
dfMerged = Join.apply(
    frame1=dfUser,
    frame2=dfProduct,
    keys1=["userid"],
    keys2=["owner"],
    transformation_ctx="dfMerged",
)

# Script generated for node Amazon S3
csvExport = glueContext.write_dynamic_frame.from_options(
    frame=dfMerged,
    connection_type="s3",
    format="csv",
    connection_options={
        "path": "s3://" + ETL_OUTPUT_PATH,
        "partitionKeys": [],
    },
    transformation_ctx="csvExport",
)

job.commit()
