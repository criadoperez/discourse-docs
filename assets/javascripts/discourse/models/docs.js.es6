import EmberObject from "@ember/object";
import { ajax } from "discourse/lib/ajax";
import Topic from "discourse/models/topic";

const Docs = EmberObject.extend({});

Docs.reopenClass({
  list(params) {
    let filters = [];
    if (params.filterCategories) {
      filters.push(`category=${params.filterCategories}`);
    }
    if (params.filterTags) {
      filters.push(`tags=${params.filterTags}`);
    }
    if (params.filterSolved) {
      filters.push(`solved=${params.filterSolved}`);
    }
    if (params.searchTerm) {
      filters.push(`search=${params.searchTerm}`);
    }
    if (params.ascending) {
      filters.push("ascending=true");
    }
    if (params.orderColumn) {
      filters.push(`order=${params.orderColumn}`);
    }
    if (params.page) {
      filters.push(`page=${params.page}`);
    }
    if (params.selectedTopic) {
      filters.push(`topic=${params.selectedTopic}`);
    }

    let promise = ajax(`/docs.json?${filters.join("&")}`);

    promise = promise.then((data) => {
      data.topics.topic_list.topics = data.topics.topic_list.topics.map(
        (topic) => {
          topic = Topic.create(topic);
          return topic;
        }
      );
      data.topic = Topic.create(data.topic);
      return data;
    });

    return promise;
  },

  loadMore(loadMoreUrl) {
    let promise = ajax(loadMoreUrl);

    promise = promise.then((data) => {
      data.topics.topic_list.topics = data.topics.topic_list.topics.map(
        (topic) => {
          topic = Topic.create(topic);
          return topic;
        }
      );
      return data;
    });

    return promise;
  },
});

export default Docs;
