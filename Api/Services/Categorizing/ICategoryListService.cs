using System.Collections;
using System.Collections.Generic;
using Api.Models;

namespace Api.Services.Categorizing
{
    public interface ICategoryListService
    {
        void CreateCategory(string categoryName);
        void CreateList(string categoryName, string listName);
        void DeleteCategory(string categoryName);
        void DeleteElement(string categoryName, string listName, string id);
        void DeleteList(string categoryName, string listName);
        Element GetElement(string categoryName, string listName, string id);
        void InsertElement(string categoryName, string listName, Element element);
        IEnumerable ListAll(string categoryName, string listName);
        IList<string> ListCategories();
        IEnumerable ListLists(string categoryName);
        void UpdateElement(string categoryName, string listName, string id, Element element);
    }
}