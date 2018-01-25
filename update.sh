#!/usr/bin/expect -f
#设置超时时间
set timeout 1
#设置密码
set password "aa123456"
#spawn为输入shell脚本
spawn ssh 007@192.168.10.111
#如果返回的内容包含"*password*",发送你设置的密码+\r(PS.这里的\r一定要加，是回车操作的意思。。。在网上搜了好多没有说明，一直以为是换行，没有加这个，结果一直执行不成功)
expect {
    "*password:*" {send "$password\r"}
}
#目录变化
expect "*#"
send "cd project/ \r"
send "cd 007statics/ \r"
send "git st \r"
send "git add "
interact