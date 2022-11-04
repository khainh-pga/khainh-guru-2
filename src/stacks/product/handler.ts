import { lamprox } from 'lamprox'
import { _create } from './functions/create'
import { _get } from './functions/get'
import { _list } from './functions/list'
import { _delete } from './functions/delete'
import { _update } from './functions/update'

export const getProduct = lamprox(_get)
export const getListProduct = lamprox(_list)
export const createProduct = lamprox(_create)
export const deleteProduct = lamprox(_delete)
export const updateProduct = lamprox(_update)
