#!/usr/bin/env clojure -M

(defn parse-line [line]
  (map #(Long/parseLong %)
       (clojure.string/split line #"\s+")))

(defn part-one [pairs]
  (let [[firsts seconds] ((juxt (partial map first) (partial map second)) pairs)
        sum (apply + (map #(Math/abs (- %1 %2)) (sort firsts) (sort seconds)))]
    sum))

(defn part-two [pairs]
  (let [[firsts seconds] ((juxt (partial map first) (partial map second)) pairs)
        counts (frequencies seconds)
        ;; Map each element in `firsts` to a count of its presence in `seconds`
        freqs (map #(get counts % 0) firsts)
        ;; Multiply each element in `firsts` to its frequency in `seconds`
        sims (map * firsts freqs)
        ;; Sum everything together
        result (apply + sims)]
    result))

(let [lines (line-seq (java.io.BufferedReader. *in*))
      pairs (map parse-line lines)]
  (println (part-one pairs))
  (println (part-two pairs)))
