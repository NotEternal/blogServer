import { STATUS } from '../constants'

export function processGetting(res: any, req: any, data: any) {
  if (data) {
    res.status(STATUS.success).json({
      data,
    })
  } else {
    res.status(STATUS.notFound).json({
      msg: 'You are searching for nothing',
      params: req.params,
    })
  }
}
