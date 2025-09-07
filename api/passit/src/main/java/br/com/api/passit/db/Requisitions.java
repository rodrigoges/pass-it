package br.com.api.passit.db;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@Entity
@Table(name = "requisitions")
@NoArgsConstructor
@AllArgsConstructor
public class Requisitions {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID requisitionId;

    @Column(name = "item_id", nullable = false)
    private UUID item;

    @Column(name = "user_id", nullable = false)
    private UUID requester;

    @Column
    @Enumerated(EnumType.STRING)
    private StatusItemEnum status = StatusItemEnum.RESERVED;

    @Column
    @CreationTimestamp
    private OffsetDateTime date = OffsetDateTime.now();
}
