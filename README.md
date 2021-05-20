# lambda_ec2-start

Start and stop ec2 instances with slack

## Environment

- Terraform
  - Api Gateway(GET)
  - Lambda (node14)
- EC2
- Slack
- Slash command

## Use slack

- Specify the instance id in jndex.js.

![スクリーンショット 2021-05-20 10 45 46](https://user-images.githubusercontent.com/5633085/118906535-eb3f8000-b958-11eb-8987-d8780ec4282d.jpg)

- status

```
/ec2 hoge status
```
- start

```
/ec2 hoge start
```
- stop

```
/ec2 hoge stop
```
