resource "aws_api_gateway_rest_api" "lambda_ec2-start" {
  name = "lambda_ec2-start"

  endpoint_configuration {
    types = ["REGIONAL"]
  }
}

resource "aws_api_gateway_method" "get-lambda_ec2-start" {
  resource_id          = aws_api_gateway_rest_api.lambda_ec2-start.root_resource_id
  rest_api_id          = aws_api_gateway_rest_api.lambda_ec2-start.id
  http_method          = "GET"
  authorization        = "NONE"
  request_validator_id = "xxxx"

  request_parameters = {
    "method.request.querystring.text"  = true
    "method.request.querystring.token" = true
  }
}

resource "aws_api_gateway_integration" "lambda_ec2-start_intergration" {
  resource_id             = aws_api_gateway_rest_api.lambda_ec2-start.root_resource_id
  rest_api_id             = aws_api_gateway_rest_api.lambda_ec2-start.id
  http_method             = aws_api_gateway_method.get-lambda_ec2-start.http_method
  type                    = "AWS"
  cache_namespace         = aws_api_gateway_rest_api.lambda_ec2-start.root_resource_id
  cache_key_parameters    = []
  content_handling        = "CONVERT_TO_TEXT"
  integration_http_method = "POST"
  passthrough_behavior    = "WHEN_NO_TEMPLATES"
  uri                     = aws_lambda_function.lambda_ec2-start.invoke_arn

  request_templates = {
    "application/json" = file("files/api-gateway/lambda_ec2-start_intergration.json")
  }
}

resource "aws_api_gateway_deployment" "lambda_ec2-start_pre" {
  depends_on  = [aws_api_gateway_rest_api.lambda_ec2-start]
  rest_api_id = aws_api_gateway_rest_api.lambda_ec2-start.id
  stage_name  = "stg"

  triggers = {
    redeployment = "v0.1"
  }

  lifecycle {
    create_before_destroy = true
  }
}

