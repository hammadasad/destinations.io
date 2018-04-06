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
end


private

def user_params
  params.require(:user).permit!
end

def destination_params
  params.require(:destination).permit!
end
