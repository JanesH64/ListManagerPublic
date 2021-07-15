using System.Collections;
using Microsoft.AspNetCore.Mvc;
using Api.Models;
using Api.Services.Categorizing;

namespace Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CategoriesController : ControllerBase
    {
        private readonly ICategoryListService _categoryListService;

        public CategoriesController(ICategoryListService categoryListService)
        {
            _categoryListService = categoryListService;
        }

        [HttpGet]
        public IEnumerable GetCategories()
        {
            return _categoryListService.ListCategories();
        }

        [HttpPost]
        public ActionResult CreateCategory([FromBody]NewNameDto category)
        {
            _categoryListService.CreateCategory(category.Name);
            return CreatedAtAction(nameof(GetLists), new {category = category.Name}, category);
        }

        [HttpDelete("{category}")]
        public ActionResult DeleteCategory(string category)
        {
            _categoryListService.DeleteCategory(category);
            return NoContent();
        }

        [HttpGet("{category}")]
        public IEnumerable GetLists(string category)
        {
            return _categoryListService.ListLists(category);
        }

        [HttpPost("{category}")]
        public ActionResult NewList(string category, [FromBody]NewNameDto list)
        {
            _categoryListService.CreateList(category, list.Name);
            return CreatedAtAction(nameof(GetList), new {category, list = list.Name}, list);
        }

        [HttpDelete("{category}/{list}")]
        public ActionResult DeleteList(string category, string list)
        {
            _categoryListService.DeleteList(category, list);
            return NoContent();
        }

        [HttpGet("{category}/{list}")]
        public IEnumerable GetList(string category, string list)
        {
            return _categoryListService.ListAll(category, list);
        }

        [HttpPost("{category}/{list}")]
        public ActionResult NewElement(string category, string list, [FromBody]Element element)
        {
            _categoryListService.InsertElement(category, list, element);
            return CreatedAtAction(nameof(GetElement), new {category, list, id = element.Id}, element);
        }

        [HttpGet("{category}/{list}/{id:length(24)}")]
        public Element GetElement(string category, string list, string id)
        {
            return _categoryListService.GetElement(category, list, id);
        }

        [HttpPut("{category}/{list}/{id:length(24)}")]
        public ActionResult UpdateElement(string category, string list, string id, [FromBody]Element element)
        {
            _categoryListService.UpdateElement(category, list, id, element);
            return Ok();
        }

        [HttpDelete("{category}/{list}/{id:length(24)}")]
        public ActionResult DeleteElement(string category, string list, string id)
        {
            _categoryListService.DeleteElement(category, list, id);
            return NoContent();
        }
    }
}
