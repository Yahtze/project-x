(ns battlecraft.game
  (:require [battlecraft.interop :as i]
            [re-frame.core :refer [dispatch]]))

(def players (atom []))

(defn draw-player [player]
  (let [{:keys [x y]} player
        graph (i/get-graph)
        sprite (i/get-sprite "playerSprite")]
    (.drawImage graph sprite x y (/ (.-width sprite) 6) (/ (.-height sprite) 6))))

(defn down-key? [key]
  (or (= key "ArrowDown")
      (= key "s")))

(defn up-key? [key]
  (or (= key "ArrowUp")
      (= key "w")))

(defn left-key? [key]
  (or (= key "ArrowLeft")
      (= key "a")))

(defn right-key? [key]
  (or (= key "ArrowRight")
      (= key "d")))

(defn directional-key? [key]
  (or (down-key? key)
      (up-key? key)
      (left-key? key)
      (right-key? key)))

(defn parse-input [b e]
  (let [player (i/get-player)
        key (.-key e)]
    (when (directional-key? key)
      (cond
        (left-key? key) (aset player "inputs" "left" b)
        (right-key? key) (aset player "inputs" "right" b)
        (up-key? key) (aset player "inputs" "up" b)
        (down-key? key) (aset player "inputs" "down" b)))))

(defn update-player-inputs []
  (let [player (i/get-player)
        player-inputs (aget player "inputs")
        socket (i/get-socket)]
    (if (every? false? (vals (js->clj player-inputs :keywordize-keys true)))
      (js/console.log "all inputs are false, no need to send any data")
      (.emit socket "player-input" player-inputs))))

(defn init-controls []
  (let [canvas (i/get-canvas)
        socket (i/get-socket)]
    (.addEventListener canvas "keydown" (partial parse-input true))
    (.addEventListener canvas "keyup" (partial parse-input false))))

(defn game-loop []
  (let [graph (i/get-graph)
        canvas (i/get-canvas)]
    (.clearRect graph 0 0 (.-width canvas) (.-height canvas))
    (doseq [player @players]
      (draw-player player))))

(defn step []
  (.requestAnimationFrame js/window step)
  (game-loop))

(defn handle-pong-check []
  (let [start (i/get-latest-ping-start)
        end (i/get-now-ms)
        diff (- end start)]
    (dispatch [:ping-updated diff])))

(defn handle-welcome [player-settings]
  (let [socket (i/get-socket)
        player-settings (js->clj player-settings :keywordize-keys true)
        player-name (if (empty? (i/get-player-name))
                      "A nameless player"
                      (i/get-player-name))
        player-details (assoc player-settings :name player-name)]
    (js/console.info "Handling welcome")
    (.emit socket "welcome-acknowledged" (clj->js player-details))))

(defn handle-spawn [player]
  (js/console.log "handling spawn")
  (i/set-player player)
  (init-controls)
  (step)
  (js/setInterval update-player-inputs (/ 1000 60)))

(defn handle-game-state [new-players]
  (reset! players (js->clj new-players :keywordize-keys true)))

(defn start []
  (let [socket (i/get-socket)]
    (i/set-graph)
    (i/show-game)
    (.emit socket "ready-to-play")))

(defn start-pings []
  (let [socket (i/get-socket)]
    (i/set-latest-ping-start)
    (.emit socket "ping-check")
    (js/setInterval
     #(let [socket (i/get-socket)]
        (i/set-latest-ping-start)
        (.emit socket "ping-check"))
     5000)))

(defn start-game []
  (i/set-canvas)
  (i/set-socket)
  (i/set-start-game start)
  (let [socket (i/get-socket)]
    (.on socket "spawn" handle-spawn)
    (.on socket "pong-check" handle-pong-check)
    (.on socket "welcome" handle-welcome)
    (.on socket "game-state" handle-game-state)
    (js/setTimeout
     start-pings
     500)))
