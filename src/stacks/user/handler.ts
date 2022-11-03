import { lamprox } from 'lamprox'
import { createUser as _create } from './functions/create'
import { getUser as _get } from './functions/get'
import { getListUser as _getList } from './functions/list'
import { deleteUser as _delete } from './functions/delete'
import { updateUser as _update } from './functions/update'

export const getUser = lamprox(_get)
export const getListUser = lamprox(_getList)
export const createUser = lamprox(_create)
export const deleteUser = lamprox(_delete)
export const updateUser = lamprox(_update)
