#!/usr/bin/env clojure -M

(defn parse-line [line]
  (map #(Integer/parseInt %)
       (clojure.string/split line #"\s+")))

(defn all-same-sign? [numbers]
  (or (every? pos? numbers)
      (every? neg? numbers)))

(defn within-range? [numbers]
  (every? #(<= 1 (Math/abs %) 3) numbers))

;; Iterates over a list of integers (levels) and returns 1 (true) if all of 
;; the following properties are true; otherwise returns 0 (false):
;;
;;  - The levels are either all increasing or all decreasing.
;;  - Any two adjacent levels differ by at least one and at most three.
;;
(defn is-safe [row]
  (let [tuples (partition 2 1 row)
        diffs (map #(apply - %) tuples)
        valid? (and (within-range? diffs) (all-same-sign? diffs))]
    (if valid? 1 0)))

(defn part-one [levels]
  (->> levels
       (map is-safe)
       (apply +)))

(let [lines (line-seq (java.io.BufferedReader. *in*))
      reports (map parse-line lines)]
  (println (part-one reports)))
