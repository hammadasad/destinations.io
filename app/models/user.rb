class User < ApplicationRecord
    has_secure_password
    has_many :user_destination_list
    has_many :destination, through: :user_destination_list
end
