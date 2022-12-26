'use strict';

const policyStatements = [{
  Effect: 'Allow',
  Action: ['logs:CreateLogStream', 'logs:CreateLogGroup', 'logs:PutLogEvents'],
  Resource: [
    {
      'Fn::Sub': 'arn:${AWS::Partition}:logs:${AWS::Region}:${AWS::AccountId}:log-group:*'
    }
  ]
}];

let policies = policyStatements;

class SimplifyDefaultExecRole {
  constructor(serverless) {
    if (
      serverless.service.custom &&
      serverless.service.custom.simplifyDefaultExecRole &&
      serverless.service.custom.simplifyDefaultExecRole.policies &&
      Array.isArray(serverless.service.custom.simplifyDefaultExecRole.policies)
    ) {
      policies.push(...serverless.service.custom.simplifyDefaultExecRole.policies);
    }

    this.hooks = {
      'before:package:finalize': function() {
        simplifyBaseIAMLogGroups(serverless);
      }
    };
  }
}

function simplifyBaseIAMLogGroups(serverless) {
  const resourceSection = serverless.service.provider.compiledCloudFormationTemplate.Resources;

  for (const key in resourceSection) {
    if (key === 'IamRoleLambdaExecution') {
      resourceSection[key].Properties.Policies[0].PolicyDocument.Statement = policies;
    }
  }
}

module.exports = SimplifyDefaultExecRole;
