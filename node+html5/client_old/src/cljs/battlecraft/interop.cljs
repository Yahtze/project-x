(ns battlecraft.interop)

(defn set-start-game [f]
  (aset js/window "startGame" f))

(defn get-start-game []
  (aget js/window "startGame"))

(defn set-socket []
  (aset js/window "gameSocket" (.io js/window "http://localhost:3000/")))

(defn get-socket []
  (aget js/window "gameSocket"))

(defn get-now-ms []
  (.getTime (js/Date.)))

(defn set-latest-ping-start []
  (aset js/window "pingStart" (get-now-ms)))

(defn get-latest-ping-start []
  (aget js/window "pingStart"))

(defn set-canvas []
  (aset js/window "gameCanvas" (.getElementById js/document "game")))

(defn get-canvas []
  (aget js/window "gameCanvas"))

(defn get-graph []
  (aget js/window "gameGraph"))

(defn get-sprite [sprite-name]
  (aget js/window sprite-name))

(defn set-player [p]
  (aset js/window "player" p))

(defn get-player []
  (aget js/window "player"))

(defn set-graph []
  (aset js/window "gameGraph" (.getContext (get-canvas) "2d")))

(defn get-menu []
  (.getElementById js/document "main-menu-wrapper"))

(defn get-player-name []
  (.-value (.getElementById js/document "username")))

(defn show-game []
  (aset (get-canvas) "style" "display" "block")
  (aset (get-menu) "style" "display" "none")
  (.focus (get-canvas)))

(defn show-menu []
  (aset (get-canvas) "style" "display" "none")
  (aset (get-menu) "style" "display" "block")
  (.focus (get-menu)))
