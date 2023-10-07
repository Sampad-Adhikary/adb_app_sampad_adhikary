from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import json, logging, os
from pymongo import MongoClient
import pymongo

# Construct the MongoDB connection URI using environment variables
mongo_uri = 'mongodb://' + os.environ["MONGO_HOST"] + ':' + os.environ["MONGO_PORT"]

# Initialize the MongoDB client and select the 'test_db' database
db = MongoClient(mongo_uri)['test_db']

# Define the name of the MongoDB collection
collection = 'todo_collection'

# Function to check if a collection is empty
def is_collection_empty(collection_name):
    return collection_name not in db.list_collection_names()

# Function to get the todo list from a collection
def get_todo_list(collection_name):
    document = db[collection_name].find_one({}) or {}
    return document.get('list', [])

# Function to create a todo collection if it doesn't exist
def create_todo_collection(collection_name):
    if collection_name not in db.list_collection_names():
        db.create_collection(collection_name)
        db[collection_name].insert_one({'list': []})

# Function to insert a todo item into a collection
def insert_todo(collection_name, todo_data):
    # Create a unique index on the 'list' field if it doesn't exist
    db[collection_name].create_index([("list", pymongo.ASCENDING)], unique=True)

    try:
        # Attempt to insert the todo item with an upsert operation
        db[collection_name].update_one({'list': {'$ne': todo_data}}, {'$push': {'list': todo_data}}, upsert=True)
        
        # Check if the item was inserted or already existed
        if db[collection_name].count_documents({'list': todo_data}) == 1:
            return True
        else:
            return False
    except pymongo.errors.DuplicateKeyError as e:
        # Handle the case where the item already exists (duplicate)
        return Response({'message': 'Todo item already exists'}, status=status.HTTP_200_OK)



# Define an APIView for handling todo list operations
class TodoListView(APIView):

    # HTTP GET request handler
    def get(self, request):
        try:
            # Check if the todo collection is empty
            if is_collection_empty(collection):
                return Response({'message': 'Database Empty'}, status=status.HTTP_200_OK)

            # Retrieve the todo list from the collection
            todos = get_todo_list(collection)

            # Check if the todo list is empty
            if not todos:
                return Response({'message': 'Todo list is empty'}, status=status.HTTP_200_OK)

            # Return the todo list as a JSON response
            return Response(todos, status=status.HTTP_200_OK)
        except Exception as e:
            # Handle exceptions and return an error response
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # HTTP POST request handler
    def post(self, request):
        try:
            # Retrieve the 'entry' and 'delete' data from the request
            todo_data = request.data.get('entry')
            delete_todo = request.data.get('delete')
            
            # If 'delete' is provided, drop the entire collection
            if delete_todo:
                db.drop_collection(collection)
                return Response({'message': 'Todo List Deleted!'}, status=status.HTTP_201_CREATED)

            # Create the todo collection if it doesn't exist
            create_todo_collection(collection)

            # Insert the todo item into the collection
            resp = insert_todo(collection, todo_data)
            if resp == True:
                return Response({'message': 'Task added successfully!!'}, status=status.HTTP_201_CREATED)
            else:
                return Response({'message': 'Task already in list!!'}, status=status.HTTP_200_OK)
        except Exception as e:
            # Handle exceptions and return an error response
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)