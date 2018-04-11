class UserDestinationListsController < ApplicationController

  def new
  end

  def index
    render "new"
  end

  def create
    user_destination_item = UserDestinationList.new
    user_destination_item.destination = Destination.new(destination_params)
    user_destination_item.user = User.new(user_params)
    user_destination_item.save
  end

  def status
      the_city = Destination.where(city: destination_params[:city])
      the_city = the_city['id']
      user_destination_item = UserDestinationList.where(user_id: user_params[:id].to_i, destination_id: the_city)
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
