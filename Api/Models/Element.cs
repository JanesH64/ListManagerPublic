using System.Dynamic;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Api.Models
{
    [BsonIgnoreExtraElements]
    public class Element
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        [BsonElement("name")]
        public string Name { get; set; }
        [BsonElement("sortingNumber")]
        public int SortingNumber { get; set; }
        [BsonElement("attributes")]
        public ExpandoObject Attributes { get; set; }
    }
}