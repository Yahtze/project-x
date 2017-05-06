(ns battlecraft.events
  (:require [re-frame.core :as re-frame :refer [reg-event-db]]
            [battlecraft.db :as db]))

(reg-event-db
 :initialize-db
 (fn [_ _]
   db/default-db))

(reg-event-db
 :ping-updated
 (fn [db [_ ping]]
   (assoc db :ping ping)))
