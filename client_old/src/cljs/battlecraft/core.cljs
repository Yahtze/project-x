(ns battlecraft.core
  (:require [reagent.core :as reagent]
            [re-frame.core :as re-frame]
            [battlecraft.events]
            [battlecraft.subs]
            [battlecraft.views :as views]
            [battlecraft.config :as config]
            [battlecraft.game :as game]))

(defn load-sprite [name src]
  (let [sprite (js/Image.)]
    (aset sprite "src" (str "game_assets/" src))
    (aset js/window name sprite)))

(defn load-assets [assets]
  (doseq [s assets]
    (let [[name src] s]
      (load-sprite name src))))

(defn dev-setup []
  (when config/debug?
    (enable-console-print!)
    (println "dev mode")))

(defn mount-root []
  (re-frame/clear-subscription-cache!)
  (reagent/render [views/main-panel]
                  (.getElementById js/document "app")))

(def assets
  [["playerSprite" "player_sprite.png"]])

(defn ^:export init []
  (re-frame/dispatch-sync [:initialize-db])
  (dev-setup)
  (game/start-game)
  (load-assets assets)
  (mount-root))
