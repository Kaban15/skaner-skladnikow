import paramiko

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('72.62.52.81', username='root', password='Ciapek515$$$')
print('Polaczono!')
ssh.close()
