class UserDestinationListsController < ApplicationController

  def new
  end

  def index
    @list_destinations = UserDestinationList.where(user_id: current_user[:id]).to_a
    @list = Array.new
    @list_destinations.each do | aDestination |
        puts "-----"
        puts aDestination.destination.to_json
        @list.push(aDestination.destination.to_json)
    end

    puts "=============INDEX========="
    puts @list
    puts "====== FINISHING PRINTING LIST DESTINATIONS"
    render "new"
  end

  def create
    destination = Destination.findBy(city: destination_params[:city])
    if destination
      if UserDestinationList.exists?(user_id: user_params[:id], destination_id: destination.id)
          render plain: "Destination for user exists"
      else
          user_destination_item = UserDestinationList.new
          user_destination_item.destination = destination
          user_destination_item.user_id = user_params[:id]
          user_destination_item.save
          render plain: "User-Destination saved"
      end
    else
        destination = Destination.new(destination_params)
        destination.save
        render plain: "Destination Created"
    end
  end

  def status
      puts "==============="
      puts "In status"
      puts "==============="
      the_city = Destination.where(city: destination_params[:city]).take!
      puts "Printing out the city \n"
      puts the_city
      the_city = the_city["id"]
      user_destination_item = UserDestinationList.where(user_id: user_params[:id].to_i, destination_id: the_city).take!
      user_destination_item['status'] = destination_params[:status]
      user_destination_item.save
  end
end


private

def user_params
  params.require(:user).permit!
end

def destination_params
  params.require(:destination).permit!
end
