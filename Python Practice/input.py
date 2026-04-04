num = int(input("Enter a number: "))

print(type(num))
print(type(int(num)))

def patt():
    for i in range(1, 4):
        for j in range(1, i + 1):
            print('k'," ")
        print()
        