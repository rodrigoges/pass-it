package br.com.api.passit.db;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface RequisitionsRepository extends JpaRepository<Requisitions, UUID> {

}
