'use strict'
import Joi from '@hapi/joi'

export const RenderAdapterResponses = {
  200: {
    description: 'success',
    example: {
      status: 'success',
      renderID: '12345'
    }
  },
  500: {
    description: 'fail',
    example: {
      status: 'fail',
      err: 'unexpected exception happen'
    }
  }
}

export const RenderAdapterBodyValidate = {
  body: Joi.object({
    company: Joi.string().required(),
    production: Joi.string().required(),
    version: Joi.string().required(),
    fileuuid: Joi.string().required(),
    outFormat: Joi.string().required()
  })
}

export const RenderAdapterBody = {
  company: {
    type: 'string',
    required: true
  },
  production: {
    type: 'string',
    required: true
  },
  version: {
    type: 'string',
    required: true
  },
  fileuuid: {
    type: 'string',
    required: true
  },
  outFormat: {
    type: 'string',
    required: true
  }
}

export const checkStatusResponses = {
  200: {
    description: `Get render job's status by TMS trace ID`,
    example: {
      'success': 'boolean',
      'complete': 'boolean',
      'fileID(optional)': 'string',
      'err(optional)': 'string'
    }
  },
  404: {
    description: `Can't find render status by TMS trace ID`,
    example: {
      'success': false,
      'complete': false,
      'err': 'Can\'t find render status by ${tmsTraceID}.'
    }
  },
  500: {
    description: `Can't connection to database`,
    example: {
      'success': false,
      'complete': false,
      'err': 'Can\'t connection to database.'
    }
  }
}

export const checkStatusValidate = {
  params: Joi.object({
    renderID: Joi.string().required()
  })
}
