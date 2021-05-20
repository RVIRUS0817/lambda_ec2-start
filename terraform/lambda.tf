resource "aws_lambda_function" "lambda_ec2-start" {
  description   = "#slack command start stop status ec2"
  s3_bucket     = "lambda"
  s3_key        = "lambda_ec2-start.zip"
  function_name = "lambda_ec2-start"
  role          = "arn:aws:iam::${var.aws_account_id}:role/LambdaEC2Control"
  handler       = "index.handler"
  runtime       = "nodejs14.x"
  memory_size   = "128"
  timeout       = "20"

  environment {
    variables = {
      S3_BUCKET           = "lambda",
      EC2_REGION          = "ap-northeast-1",
      SLASH_COMMAND_TOKEN = "xxxxxxxxxxxxxxxxxx"
    }
  }
}
