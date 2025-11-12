package com.bankingapp.Server.model;

import com.bankingapp.Server.model.enums.SupportTicketStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "support_tickets")
public class SupportTicket {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long ticketId;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id", nullable = false)
	private User user;

	@Column(nullable = false)
	private String subject;

	@Column(length = 2000)
	private String description;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	@Builder.Default
	private SupportTicketStatus status = SupportTicketStatus.OPEN;

	@Column(nullable = false, updatable = false)
	private Instant createdAt;

	@PrePersist
	public void prePersist() {
		if (createdAt == null) createdAt = Instant.now();
	}
}
