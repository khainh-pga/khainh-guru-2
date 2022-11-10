import sys
from awsglue.transforms import *
from awsglue.utils import getResolvedOptions
from pyspark.context import SparkContext
from awsglue.context import GlueContext
from awsglue.job import Job
import boto3
client = boto3.client('s3')

args = getResolvedOptions(sys.argv, ["JOB_NAME", "GLUE_DATABASE", "GLUE_USER_TABLE", "GLUE_PRODUCT_TABLE", "DATALAKE_BUCKET_NAME", "ETL_OUTPUT_PREFIX", "ETL_OUTPUT_PATH"])
sc = SparkContext()
glueContext = GlueContext(sc)
spark = glueContext.spark_session
job = Job(glueContext)

JOB_NAME=args['JOB_NAME']
GLUE_DATABASE = args['GLUE_DATABASE']
GLUE_USER_TABLE = args['GLUE_USER_TABLE']
GLUE_PRODUCT_TABLE = args['GLUE_PRODUCT_TABLE']
ETL_OUTPUT_PATH = args['ETL_OUTPUT_PATH']
DATALAKE_BUCKET_NAME = args['DATALAKE_BUCKET_NAME']
ETL_OUTPUT_PREFIX = args['ETL_OUTPUT_PREFIX']

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
renamedUserProduct = ApplyMapping.apply(
    frame=dfUser,
    mappings=[
        ("createdat", "long", "`user-createdat`", "long"),
        ("name", "string", "`user-name`", "string"),
        ("userid", "string", "userid", "string"),
        ("updatedat", "long", "`user-updatedat`", "long"),
    ],
    transformation_ctx="renamedUserProduct",
)

# Script generated for node Join
dfMerged = Join.apply(
    frame1=dfProduct,
    frame2=renamedUserProduct,
    keys1=["owner"],
    keys2=["userid"],
    transformation_ctx="dfMerged",
)

# Script generated for node Amazon S3
# csvExport = glueContext.write_dynamic_frame.from_options(
#     frame=dfMerged,
#     connection_type="s3",
#     format="csv",
#     connection_options={
#         "path": "s3://" + ETL_OUTPUT_PATH,
#         "partitionKeys": [],
#     },
#     transformation_ctx="csvExport",
# )

##Write the DynamicFrame as a file in CSV format to a folder in an S3 bucket.
##It is possible to write to any Amazon data store (SQL Server, Redshift, etc) by using any previously defined connections.
exportData = glueContext.write_dynamic_frame.from_options(
  frame = dfMerged, 
  connection_type = "s3", 
  connection_options = {
    "path": "s3://" + ETL_OUTPUT_PATH
  }, 
  format = "csv", 
  transformation_ctx = "exportData"
)

# rename created file
response = client.list_objects(
    Bucket=DATALAKE_BUCKET_NAME,
    Prefix=ETL_OUTPUT_PREFIX,
)

#getting all the content/file inside the bucket. 
# response = client.list_objects_v2(Bucket=bucket_name)
names = response["Contents"]

#Find out the file which have part-000* in it's Key
particulars = [name['Key'] for name in names if '-part-' in name['Key']]

#Find out the prefix of part-000* because we want to retain the partitions schema 
location = [particular.split('-part-')[0] for particular in particulars]

#Constrain - copy_object has limit of 5GB.datepartition=20190131
for key,particular in enumerate(particulars):
    client.copy_object(Bucket=DATALAKE_BUCKET_NAME, CopySource=DATALAKE_BUCKET_NAME + "/" + particular, Key=location[key]+".csv")
    client.delete_object(Bucket=DATALAKE_BUCKET_NAME, Key=particular)


job.commit()
