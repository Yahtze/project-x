(ns battlecraft.views
  (:require [re-frame.core :as re-frame :refer [subscribe]]
            [battlecraft.interop :as i]))

(defn main-menu []
  [:div#main-menu-wrapper
   #_[:img#logo {:src "img/logo.png"}]
   [:div#main-menu
    [:input#username.menu-item {:type "text" :placeholder "Enter a username"}]
    [:button#play.menu-item {:on-click (i/get-start-game)}"Play"]]])

(defn ping []
  (let [current-ping @(subscribe [:ping])]
    (when current-ping
      [:div#ping (str "ping: " current-ping)])))

(defn main-panel []
  [:div.wrapper
   (ping)
   (main-menu)])
