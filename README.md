# serverless-simplify-default-exec-role-plugin

> Fixes "IamRoleLambdaExecution - Maximum policy size of 10240 bytes exceeded" error

This plugin works by modifying the Cloudformation stack before deployment.

It searches for the `IamRoleLambdaExecution` resource and modifies the only policy attached to this role.

## Install

```
$ npm i -D git+https://git@github.com:omvmike/serverless-simplify-default-exec-role-plugin.git
```

## Usage

In your `serverless.yml` file:

```yaml
plugins:
  - serverless-simplify-default-exec-role-plugin
```

## Explanation

By default, Serverless framework creates such role:

```json5
{
  Effect: "Allow",
  Action: ["logs:CreateLogStream", "logs:CreateLogGroup"],
  Resource: [
    {
      "Fn::Sub": "arn:${AWS::Partition}:logs:${AWS::Region}:${AWS::AccountId}:log-group:/aws/lambda/production-users-createUser:*",
    },
    {
      "Fn::Sub": "arn:${AWS::Partition}:logs:${AWS::Region}:${AWS::AccountId}:log-group:/aws/lambda/production-users-updateUser:*",
    },
    {
      "Fn::Sub": "arn:${AWS::Partition}:logs:${AWS::Region}:${AWS::AccountId}:log-group:/aws/lambda/production-users-deleteUser:*",
    },
    // dozens of identical lines
  ],
}
```

When you reach a certain project size, deployment will fail since this role will exceed 10 KB limit.

This plugin simplifies the default execution role to smth like this:

```json5
{
  Effect: "Allow",
  Action: ["logs:CreateLogStream", "logs:CreateLogGroup"],
  Resource: [
    {
      "Fn::Sub": "arn:${AWS::Partition}:logs:${AWS::Region}:${AWS::AccountId}:log-group:*",
    },
  ],
}
```

## Customization

You can add your own policies by adding `custom.simplifyDefaultExecRole` section to your `serverless.yml` file:

For example, if you want to add elastic file system permissions

```yaml
simplifyDefaultExecRole:
  policies:
    - Effect: Allow
      Action:
        - "elasticfilesystem:ClientMount"
        - "elasticfilesystem:ClientWrite"
      Resource:
        -  "arn:aws:elasticfilesystem:us-east-1:123456789012:file-system/fs-12345678"  // replace with your own
```

## License

MIT ©
