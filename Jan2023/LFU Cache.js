class LFUCache {
    var capacity: Int
    var curSize = 0
    var cache: [Int: Int] = [:]
    var keyToFreq: [Int: Int] = [:]
    var freqToKeys: [Int: [Int]] = [:]
    var freqs: [Int] = []

    init(_ capacity: Int) {
        self.capacity = capacity
    }
    
    func get(_ key: Int) -> Int {
        if let val = cache[key] {
            // update item frequency
            let oldFreq = keyToFreq[key]!
            let newFreq = oldFreq + 1
            keyToFreq[key] = newFreq
            // update key array for specific frequencies
            var keys = freqToKeys[oldFreq]!
            keys.remove(at: keys.firstIndex(of: key)!)
            freqToKeys[oldFreq] = keys
            freqToKeys[newFreq] = (freqToKeys[newFreq] ?? []) + [key]
            // update frequency array
            freqs.remove(at: freqs.firstIndex(of: oldFreq)!)
            if let ind = freqs.firstIndex(where: { $0 >= newFreq }) {
                freqs.insert(newFreq, at: ind)
            } else {
                freqs.append(newFreq)
            }

            // return the value
            return val
        } else {
            // no value found
            return -1
        }
    }
    
    func put(_ key: Int, _ value: Int) {
        if capacity == 0 {
            return
        }

        let incFreq = cache[key] == nil && curSize < capacity
        let oldFreq = keyToFreq[key] ?? 0
        let newFreq = oldFreq + 1
        var keys = freqToKeys[newFreq] ?? []
        // add key to key array for new frequency
        freqToKeys[newFreq] = keys + [key]
        // update item frequency
        keyToFreq[key] = newFreq

        // update the data for the key which exists in the cache
        if cache[key] != nil {
            // remove key from key array for old frequency
            keys = freqToKeys[oldFreq]!
            keys.remove(at: keys.firstIndex(of: key)!)
            freqToKeys[oldFreq] = keys
            // update the item frequency in the frequency array
            freqs.remove(at: freqs.firstIndex(of: oldFreq)!)
            if let ind = freqs.firstIndex(where: { $0 >= newFreq }) {
                freqs.insert(newFreq, at: ind)
            } else {
                freqs.append(newFreq)
            }
        } else if curSize == capacity {
            // exceeds capacity, delete one item
            let smallestFreq = freqs[0]
            keys = freqToKeys[smallestFreq]!
            let keyToRemove = keys[0]
            keys.remove(at: 0)
            freqToKeys[smallestFreq] = keys
            keyToFreq[keyToRemove] = nil
            freqs[0] = 1
            cache[keyToRemove] = nil
        } else {
            // key does not exist in the cache and item count is below cap
            freqs.insert(1, at: 0)
        }
        if incFreq {
            curSize += 1
        }

        cache[key] = value
    }
}