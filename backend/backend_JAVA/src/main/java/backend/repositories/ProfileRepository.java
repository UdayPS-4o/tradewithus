package backend.repositories;

import backend.models.Profile;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProfileRepository extends MongoRepository<Profile, String> {
    
    Optional<Profile> findByProfileId(String profileId);
    
    boolean existsByProfileId(String profileId);
    
    void deleteByProfileId(String profileId);
    
    long count();
} 
