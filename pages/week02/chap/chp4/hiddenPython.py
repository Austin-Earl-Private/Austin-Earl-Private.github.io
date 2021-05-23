# Function for printing out each element of a tuple
def printTuple(tup):
    for ele in tup:
        if type(ele) is tuple:
            printTuple(ele)
        else:
            print(ele)


# Tuple 1
tuple1 = (1, 1.1)
# Print Each element in a Tuple
printTuple(tuple1)
# Create tuple2
tuple2 = ("two", True, (2, 2 + 2j))
# Print Tuple2 out
printTuple(tuple2)

        
