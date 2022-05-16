
text= "xcqv{gvyavn_zvztv_etvtddlnxcgy}"
alpha = 'abcdefghijklmnopqrstuvwxyz' # ABCDEFGHIJKLMNOPQRSTUVWXYZ
result=""

for let in text:
    if let == '_':
        continue
    if ord(let)+8 > ord('z'):
        result += chr(ord(let)-8)
    else:
        result += chr(ord(let)+8)

print(result)