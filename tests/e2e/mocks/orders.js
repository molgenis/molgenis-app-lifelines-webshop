const orders = {
  'href': '/api/v2/lifelines_order',
  'meta': {
    'href': '/api/v2/lifelines_order',
    'hrefCollection': '/api/v2/lifelines_order',
    'name': 'lifelines_order',
    'label': 'order',
    'attributes': [
      {
        'href': '/api/v2/lifelines_order/meta/orderNumber',
        'fieldType': 'STRING',
        'name': 'orderNumber',
        'label': 'orderNumber',
        'attributes': [

        ],
        'maxLength': 255,
        'auto': false,
        'nillable': false,
        'readOnly': true,
        'labelAttribute': true,
        'unique': true,
        'visible': true,
        'lookupAttribute': true,
        'isAggregatable': false
      },
      {
        'href': '/api/v2/lifelines_order/meta/contents',
        'fieldType': 'FILE',
        'name': 'contents',
        'label': 'contents',
        'attributes': [

        ],
        'refEntity': {
          'href': '/api/v2/sys_FileMeta',
          'hrefCollection': '/api/v2/sys_FileMeta',
          'name': 'sys_FileMeta',
          'label': 'File metadata',
          'attributes': [
            {
              'href': '/api/v2/sys_FileMeta/meta/id',
              'fieldType': 'STRING',
              'name': 'id',
              'label': 'Id',
              'attributes': [

              ],
              'maxLength': 255,
              'auto': true,
              'nillable': false,
              'readOnly': true,
              'labelAttribute': false,
              'unique': true,
              'visible': false,
              'lookupAttribute': false,
              'isAggregatable': false
            },
            {
              'href': '/api/v2/sys_FileMeta/meta/filename',
              'fieldType': 'STRING',
              'name': 'filename',
              'label': 'Filename',
              'attributes': [

              ],
              'maxLength': 255,
              'auto': false,
              'nillable': false,
              'readOnly': false,
              'labelAttribute': true,
              'unique': false,
              'visible': true,
              'lookupAttribute': true,
              'isAggregatable': false
            },
            {
              'href': '/api/v2/sys_FileMeta/meta/url',
              'fieldType': 'HYPERLINK',
              'name': 'url',
              'label': 'URL',
              'description': 'File download URL',
              'attributes': [

              ],
              'maxLength': 255,
              'auto': false,
              'nillable': false,
              'readOnly': false,
              'labelAttribute': false,
              'unique': true,
              'visible': true,
              'lookupAttribute': false,
              'isAggregatable': false
            }
          ],
          'labelAttribute': 'filename',
          'idAttribute': 'id',
          'lookupAttributes': [
            'filename',
            'contentType'
          ],
          'isAbstract': false,
          'writable': true,
          'languageCode': 'en',
          'permissions': [
            'READ_METADATA',
            'UPDATE_DATA',
            'DELETE_DATA',
            'AGGREGATE_DATA',
            'ADD_DATA',
            'COUNT_DATA',
            'READ_DATA'
          ]
        },
        'auto': false,
        'nillable': false,
        'readOnly': false,
        'labelAttribute': false,
        'unique': false,
        'visible': true,
        'lookupAttribute': false,
        'isAggregatable': false
      },
      {
        'href': '/api/v2/lifelines_order/meta/submissionDate',
        'fieldType': 'DATE_TIME',
        'name': 'submissionDate',
        'label': 'submissionDate',
        'attributes': [

        ],
        'auto': false,
        'nillable': true,
        'readOnly': false,
        'labelAttribute': false,
        'unique': false,
        'visible': true,
        'lookupAttribute': false,
        'isAggregatable': false
      },
      {
        'href': '/api/v2/lifelines_order/meta/creationDate',
        'fieldType': 'DATE_TIME',
        'name': 'creationDate',
        'label': 'creationDate',
        'attributes': [

        ],
        'auto': true,
        'nillable': false,
        'readOnly': true,
        'labelAttribute': false,
        'unique': false,
        'visible': true,
        'lookupAttribute': false,
        'isAggregatable': false
      },
      {
        'href': '/api/v2/lifelines_order/meta/updateDate',
        'fieldType': 'DATE_TIME',
        'name': 'updateDate',
        'label': 'updateDate',
        'attributes': [

        ],
        'auto': false,
        'nillable': true,
        'readOnly': false,
        'labelAttribute': false,
        'unique': false,
        'visible': true,
        'lookupAttribute': false,
        'isAggregatable': false
      },
      {
        'href': '/api/v2/lifelines_order/meta/projectNumber',
        'fieldType': 'STRING',
        'name': 'projectNumber',
        'label': 'project number',
        'attributes': [

        ],
        'maxLength': 255,
        'auto': false,
        'nillable': true,
        'readOnly': false,
        'labelAttribute': false,
        'unique': false,
        'visible': true,
        'lookupAttribute': false,
        'isAggregatable': false
      },
      {
        'href': '/api/v2/lifelines_order/meta/name',
        'fieldType': 'STRING',
        'name': 'name',
        'label': 'Name',
        'attributes': [

        ],
        'maxLength': 255,
        'auto': false,
        'nillable': true,
        'readOnly': false,
        'labelAttribute': false,
        'unique': false,
        'visible': true,
        'lookupAttribute': false,
        'isAggregatable': false
      },
      {
        'href': '/api/v2/lifelines_order/meta/applicationForm',
        'fieldType': 'FILE',
        'name': 'applicationForm',
        'label': 'Application Form',
        'description': 'Word or text file to describe the request',
        'attributes': [

        ],
        'refEntity': {
          'href': '/api/v2/sys_FileMeta',
          'hrefCollection': '/api/v2/sys_FileMeta',
          'name': 'sys_FileMeta',
          'label': 'File metadata',
          'attributes': [
            {
              'href': '/api/v2/sys_FileMeta/meta/id',
              'fieldType': 'STRING',
              'name': 'id',
              'label': 'Id',
              'attributes': [

              ],
              'maxLength': 255,
              'auto': true,
              'nillable': false,
              'readOnly': true,
              'labelAttribute': false,
              'unique': true,
              'visible': false,
              'lookupAttribute': false,
              'isAggregatable': false
            },
            {
              'href': '/api/v2/sys_FileMeta/meta/filename',
              'fieldType': 'STRING',
              'name': 'filename',
              'label': 'Filename',
              'attributes': [

              ],
              'maxLength': 255,
              'auto': false,
              'nillable': false,
              'readOnly': false,
              'labelAttribute': true,
              'unique': false,
              'visible': true,
              'lookupAttribute': true,
              'isAggregatable': false
            },
            {
              'href': '/api/v2/sys_FileMeta/meta/url',
              'fieldType': 'HYPERLINK',
              'name': 'url',
              'label': 'URL',
              'description': 'File download URL',
              'attributes': [

              ],
              'maxLength': 255,
              'auto': false,
              'nillable': false,
              'readOnly': false,
              'labelAttribute': false,
              'unique': true,
              'visible': true,
              'lookupAttribute': false,
              'isAggregatable': false
            }
          ],
          'labelAttribute': 'filename',
          'idAttribute': 'id',
          'lookupAttributes': [
            'filename',
            'contentType'
          ],
          'isAbstract': false,
          'writable': true,
          'languageCode': 'en',
          'permissions': [
            'READ_METADATA',
            'UPDATE_DATA',
            'DELETE_DATA',
            'AGGREGATE_DATA',
            'ADD_DATA',
            'COUNT_DATA',
            'READ_DATA'
          ]
        },
        'auto': false,
        'nillable': true,
        'readOnly': false,
        'labelAttribute': false,
        'unique': false,
        'visible': true,
        'lookupAttribute': false,
        'isAggregatable': false
      },
      {
        'href': '/api/v2/lifelines_order/meta/state',
        'fieldType': 'ENUM',
        'name': 'state',
        'label': 'State',
        'attributes': [

        ],
        'enumOptions': [
          'Draft',
          'Submitted',
          'Approved',
          'Rejected'
        ],
        'maxLength': 255,
        'auto': false,
        'nillable': false,
        'readOnly': false,
        'defaultValue': 'Draft',
        'labelAttribute': false,
        'unique': false,
        'visible': true,
        'lookupAttribute': false,
        'isAggregatable': false
      },
      {
        'href': '/api/v2/lifelines_order/meta/email',
        'fieldType': 'STRING',
        'name': 'email',
        'label': 'email',
        'attributes': [

        ],
        'maxLength': 255,
        'auto': false,
        'nillable': true,
        'readOnly': false,
        'labelAttribute': false,
        'unique': false,
        'visible': true,
        'lookupAttribute': false,
        'isAggregatable': false
      },
      {
        'href': '/api/v2/lifelines_order/meta/user',
        'fieldType': 'STRING',
        'name': 'user',
        'label': 'user',
        'attributes': [

        ],
        'maxLength': 255,
        'auto': false,
        'nillable': true,
        'readOnly': false,
        'labelAttribute': false,
        'unique': false,
        'visible': true,
        'lookupAttribute': false,
        'isAggregatable': false
      }
    ],
    'labelAttribute': 'orderNumber',
    'idAttribute': 'orderNumber',
    'lookupAttributes': [
      'orderNumber'
    ],
    'isAbstract': false,
    'writable': true,
    'languageCode': 'en',
    'permissions': [
      'READ_METADATA',
      'UPDATE_DATA',
      'DELETE_DATA',
      'AGGREGATE_DATA',
      'ADD_DATA',
      'COUNT_DATA',
      'READ_DATA'
    ]
  },
  'start': 0,
  'num': 100,
  'total': 3,
  'items': [
    {
      '_href': '/api/v2/lifelines_order/896824',
      'orderNumber': '896824',
      'contents': {
        '_href': '/api/v2/sys_FileMeta/aaaac33ldfgnm5qlk4jsdoiaae',
        'id': 'aaaac33ldfgnm5qlk4jsdoiaae',
        'filename': 'cart.json',
        'url': 'http://localhost:443/files/aaaac33ldfgnm5qlk4jsdoiaae'
      },
      'submissionDate': '2020-01-03T11:08:45Z',
      'creationDate': '2020-01-03T11:08:58Z',
      'updateDate': '2020-01-03T11:10:17Z',
      'projectNumber': 'bla',
      'name': 'bla',
      'applicationForm': {
        '_href': '/api/v2/sys_FileMeta/aaaac33ldak4y5qlk4jsdoiaae',
        'id': 'aaaac33ldak4y5qlk4jsdoiaae',
        'filename': 'sys_L10nString.csv',
        'url': 'http://localhost:443/files/aaaac33ldak4y5qlk4jsdoiaae'
      },
      'state': 'Approved',
      'email': 'max@elynor.com',
      'user': 'max'
    },
    {
      '_href': '/api/v2/lifelines_order/475593',
      'orderNumber': '475593',
      'contents': {
        '_href': '/api/v2/sys_FileMeta/aaaac33lchfkk5qlk4jsdoiaae',
        'id': 'aaaac33lchfkk5qlk4jsdoiaae',
        'filename': 'blob',
        'url': 'http://localhost:443/files/aaaac33lchfkk5qlk4jsdoiaae'
      },
      'submissionDate': '2020-01-03T11:01:51Z',
      'creationDate': '2020-01-03T10:54:51Z',
      'updateDate': '2020-01-03T11:01:51Z',
      'projectNumber': 'filetest',
      'name': 'test',
      'applicationForm': {
        '_href': '/api/v2/sys_FileMeta/aaaac33lchflm5qlk4jsdoiaae',
        'id': 'aaaac33lchflm5qlk4jsdoiaae',
        'filename': 'sys_L10nString.csv',
        'url': 'http://localhost:443/files/aaaac33lchflm5qlk4jsdoiaae'
      },
      'state': 'Submitted',
      'email': 'max@elynor.com',
      'user': 'max'
    },
    {
      '_href': '/api/v2/lifelines_order/12666',
      'orderNumber': '12666',
      'contents': {
        '_href': '/api/v2/sys_FileMeta/aaaac33la7ma65qlk4jsdoiaae',
        'id': 'aaaac33la7ma65qlk4jsdoiaae',
        'filename': 'blob',
        'url': 'http://localhost:443/files/aaaac33la7ma65qlk4jsdoiaae'
      },
      'submissionDate': '2020-01-03T10:51:03Z',
      'creationDate': '2020-01-03T10:51:13Z',
      'updateDate': '2020-01-03T10:51:03Z',
      'projectNumber': 'test',
      'name': 'test',
      'state': 'Submitted',
      'email': 'max@elynor.com',
      'user': 'max'
    }
  ]
}

module.exports = {
  orders
}
