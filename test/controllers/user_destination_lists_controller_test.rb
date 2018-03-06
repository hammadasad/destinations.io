require 'test_helper'

class UserDestinationListsControllerTest < ActionDispatch::IntegrationTest
  test "should get new" do
    get user_destination_lists_new_url
    assert_response :success
  end

end
