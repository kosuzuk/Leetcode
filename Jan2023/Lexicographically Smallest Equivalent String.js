class Solution {
    func smallestEquivalentString(_ s1: String, _ s2: String, _ baseStr: String) -> String {
        var groupNumToGroup: [Int: Set<Character>] = [:]
        var charToGroupNum: [Character: Int] = [:]
        var nextGroupNum = 0
        let s1Arr = Array(s1)
        let s2Arr = Array(s2)

        for i in 0..<s1.count {
            let char1 = s1Arr[i]
            let char2 = s2Arr[i]
            let groupNum1 = charToGroupNum[char1]
            let groupNum2 = charToGroupNum[char2]

            if groupNum1 == nil && groupNum2 == nil {
                groupNumToGroup[nextGroupNum] = Set([char1, char2])
                charToGroupNum[char1] = nextGroupNum
                charToGroupNum[char2] = nextGroupNum
                nextGroupNum += 1
            } else if groupNum1 != nil && groupNum2 == nil {
                groupNumToGroup[groupNum1!]!.insert(char2)
                charToGroupNum[char2] = groupNum1!
            } else if groupNum1 == nil && groupNum2 != nil {
                groupNumToGroup[groupNum2!]!.insert(char1)
                charToGroupNum[char1] = groupNum2!
            } else if groupNum1 != groupNum2 {
                let group1 = groupNumToGroup[groupNum1!]!
                let group2 = groupNumToGroup[groupNum2!]!

                groupNumToGroup[groupNum1!] = group1.union(group2)
                for char in group2 {
                    charToGroupNum[char] = groupNum1!
                }
            }
        }

        var smallestLetterInGroup: [Int: Character] = [:]
        for (groupNum, set) in groupNumToGroup {
            smallestLetterInGroup[groupNum] = set.min()!
        }
        var res: [Character] = []

        for char in baseStr {
            if let groupNum = charToGroupNum[char] {
                res.append(smallestLetterInGroup[groupNum]!)
            } else {
                res.append(char)
            }
        }

        return String(res)
    }
}

