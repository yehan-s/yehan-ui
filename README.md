编写的shell文件
vim init.shell

for i in components core docs hooks theme utils; do
 cd $i
 pnpm init
 cd ..

done