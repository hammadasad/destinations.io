class Destination < ApplicationRecord
    belongs_to :country
    has_many :user_destination_list
    has_many :user, through: :user_destination_list
end
