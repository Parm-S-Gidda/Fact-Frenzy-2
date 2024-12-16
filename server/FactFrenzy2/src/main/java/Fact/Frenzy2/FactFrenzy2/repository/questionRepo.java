package Fact.Frenzy2.FactFrenzy2.repository;

import Fact.Frenzy2.FactFrenzy2.modal.question;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface questionRepo extends MongoRepository<question, String> {
    @Aggregation(pipeline = {
            "{ $match: { difficulty: ?0 } }",
            "{ $sample: { size: ?1 } }"
    })
    List<question> findRandomQuestionsByDifficulty(int difficulty, int amount);
}