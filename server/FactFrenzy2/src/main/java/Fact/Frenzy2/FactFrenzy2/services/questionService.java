package Fact.Frenzy2.FactFrenzy2.services;


import Fact.Frenzy2.FactFrenzy2.modal.question;
import Fact.Frenzy2.FactFrenzy2.repository.questionRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class questionService {

    @Autowired
    private questionRepo questionRepo; // Basic CRUD repository
    @Autowired
    private MongoTemplate mongoTemplate; // MongoTemplate for custom queries

    // Custom method to find random questions by difficulty
    public List<question> findRandomQuestionsByDifficulty(int amount, int difficulty) {
        // Create the aggregation pipeline

        System.out.println("we're in : " + difficulty);

        Aggregation aggregation = Aggregation.newAggregation(
                Aggregation.match(Criteria.where("difficulty").is(0)) // Match by difficulty
              //  Aggregation.sample(amount) // Randomly sample the documents
        );

        // Execute the aggregation query
        AggregationResults<question> results = mongoTemplate.aggregate(aggregation, question.class, question.class);

        System.out.println(results.getMappedResults());
        System.out.println("Aggregation results: " + results.getMappedResults().size());
        // Return the result
        return results.getMappedResults();
    }
}