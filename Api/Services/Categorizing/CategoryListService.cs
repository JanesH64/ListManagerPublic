using System;
using System.Collections;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Security.Authentication;
using Api.Models;
using Microsoft.Extensions.Configuration;
using MongoDB.Driver;

namespace Api.Services.Categorizing
{
    public class CategoryListService : ICategoryListService
    {
        private readonly char[] _forbiddenChars = { '/', '\\', '.', ' ', '\"', '$', '\0' };
        private readonly string[] _specialDbs = { "admin", "config", "local" };
        private const string HIDDEN_COLLECTION_START = "__hidden";
        private string ForbiddenCharMessage => $"Invalid characters found, not allowed are [{string.Join(", ", _forbiddenChars)}].";
        private readonly string[] _specialCollectionNameStarts = { "system.", HIDDEN_COLLECTION_START };
        private readonly MongoClient _mongoClient;

        public CategoryListService(IConfiguration configuration)
        {
            var connectionString = configuration["MONGO_URI"];
            var settings = MongoClientSettings.FromUrl(new MongoUrl(connectionString));
            settings.SslSettings = new SslSettings() { EnabledSslProtocols = SslProtocols.Tls12 };

            _mongoClient = new MongoClient(settings);

        }
        private IMongoDatabase GetDatabase(string category)
        {
            if (_forbiddenChars.Any(category.Contains))
            {
                throw new ArgumentException(ForbiddenCharMessage);
            }
            if (_specialDbs.Contains(category.ToLower()))
            {
                throw new ArgumentException("Invalid name.");
            }
            return _mongoClient.GetDatabase(category);
        }
        private IMongoCollection<Element> GetCollection(string category, string list)
        {
            var db = GetDatabase(category);
            if (_forbiddenChars.Any(list.Contains))
            {
                throw new ArgumentException(ForbiddenCharMessage);
            }
            if (list.StartsWith(HIDDEN_COLLECTION_START))
            {
                throw new ArgumentException("Invalid name.");
            }
            return db.GetCollection<Element>(list);
        }
        public IList<string> ListCategories()
        {
            return _mongoClient.ListDatabaseNames().ToEnumerable().Where(name => !_specialDbs.Contains(name.ToLower())).ToList();
        }
        public void CreateCategory(string category)
        {
            if (category.Length >= 64)
            {
                throw new ArgumentException("Too many characters used max: 63.");
            }
            if (_forbiddenChars.Any(category.Contains))
            {
                throw new ArgumentException(ForbiddenCharMessage);
            }
            if (_specialDbs.Contains(category.ToLower()))
            {
                throw new ArgumentException("Invalid name.");
            }
            if (ListCategories().Select(currentCategory => currentCategory.ToLower()).Contains(category.ToLower()))
            {
                throw new ArgumentException($"Category '{category}' already exists.");
            }
            var database = _mongoClient.GetDatabase(category);
            database.CreateCollection(HIDDEN_COLLECTION_START);
        }
        public void DeleteCategory(string category)
        {
            if (_specialDbs.Contains(category.ToLower()))
            {
                throw new ArgumentException("Invalid name.");
            }
            if (!ListCategories().Contains(category))
            {
                throw new KeyNotFoundException($"Category '{category}' does not exist.");
            }
            _mongoClient.DropDatabase(category);
        }
        public IEnumerable ListLists(string category)
        {
            var db = GetDatabase(category);
            return db.ListCollectionNames().ToEnumerable().Where(name => !_specialCollectionNameStarts.Any(name.StartsWith)).ToList();
        }
        public void CreateList(string category, string list)
        {
            var db = GetDatabase(category);
            if (list.Length >= 192)
            {
                throw new ArgumentException("Too many characters used max: 191.");
            }
            if (_forbiddenChars.Any(list.Contains))
            {
                throw new ArgumentException(ForbiddenCharMessage);
            }
            if (db.ListCollectionNames().ToList().Contains(list))
            {
                throw new ArgumentException($"List '{list}' already exists.");
            }
            if (list.StartsWith(HIDDEN_COLLECTION_START))
            {
                throw new ArgumentException("Invalid name.");
            }
            db.CreateCollection(list);
        }
        public void DeleteList(string category, string list)
        {
            var db = GetDatabase(category);
            if (!db.ListCollectionNames().ToEnumerable().Contains(list))
            {
                throw new KeyNotFoundException($"List '{list}' does not exist.");
            }
            db.DropCollection(list);
        }
        public IEnumerable ListAll(string category, string list)
        {
            var collection = GetCollection(category, list);
            return collection.Find(element => true).ToEnumerable();
        }
        public Element GetElement(string category, string list, string id)
        {
            var collection = GetCollection(category, list);
            var result = collection.Find(element => element.Id == id).FirstOrDefault();
            if (result == null)
            {
                throw new KeyNotFoundException($"The id: '{id}' does not exist.");
            }
            return result;
        }
        public void InsertElement(string category, string list, Element element)
        {
            var collection = GetCollection(category, list);
            element.Attributes ??= new ExpandoObject();
            element.Id = null;
            collection.InsertOne(element);
        }
        public void UpdateElement(string category, string list, string id, Element element)
        {
            var collection = GetCollection(category, list);
            element.Attributes ??= new ExpandoObject();
            element.Id ??= id;
            if (element.Id != id)
            {
                throw new ArgumentException($"The id: '{id}' is not equal to {element.Id}.");
            }
            var result = collection.ReplaceOne(elementModel => elementModel.Id == id, element);
            if (result.MatchedCount == 0)
            {
                throw new KeyNotFoundException($"The id: '{id}' does not exist.");
            }
        }
        public void DeleteElement(string category, string list, string id)
        {
            var collection = GetCollection(category, list);
            var result = collection.DeleteOne(element => element.Id == id);
            if (result.DeletedCount == 0)
            {
                throw new KeyNotFoundException($"The id: '{id}' does not exist.");
            }
        }
    }
}