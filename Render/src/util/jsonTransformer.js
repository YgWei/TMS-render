'use strict'
// initial watcher
export default {
  toMsg: (jsonTransformData, body, tmsRespondBody) => {
    const msg = {
      request_id: body.traceID,
      company: body.company,
      category: body.production,
      render_type: body.outFormat,
      meta: {},
      info: {
        fileName: body.fileuuid.replace('.xml', ''),
        printtype: jsonTransformData.policyinfo.printtype,
        productionType: jsonTransformData.policyinfo.productionInfo.type,
        company: jsonTransformData.policyinfo.productionInfo.company,
        version: jsonTransformData.policyinfo.version,
        tms: {
          company: body.company, // get from request
          production: body.production, // get from request
          version: body.template.version,
          projectId: body.template.projectId,
          entryPoint: body.template.entrypoint
        },
        tmsTraceID: body.traceID
      },
      render_src_files: [
        body.jsonFile
      ]
    }

    return JSON.stringify(msg)
  }
}
