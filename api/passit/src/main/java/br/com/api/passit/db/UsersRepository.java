package br.com.api.passit.db;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface UsersRepository extends JpaRepository<Users, UUID> {

    Optional<Users> findByEmail(String email);

    Optional<Users> findByNationalIdentifier(String nationalIdentifier);
}
