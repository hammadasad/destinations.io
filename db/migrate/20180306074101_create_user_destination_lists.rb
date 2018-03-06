class CreateUserDestinationLists < ActiveRecord::Migration[5.0]
  def change
    create_table :user_destination_lists do |t|
      t.belongs_to :destination
      t.belongs_to :user
      t.string :status
      t.timestamps
    end
  end
end
