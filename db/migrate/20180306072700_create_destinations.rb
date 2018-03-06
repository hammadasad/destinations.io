class CreateDestinations < ActiveRecord::Migration[5.0]
  def change
    create_table :destinations do |t|
      t.string :city
      t.decimal :lat
      t.decimal :long
      t.belongs_to :country
      t.timestamps
    end
  end
end
