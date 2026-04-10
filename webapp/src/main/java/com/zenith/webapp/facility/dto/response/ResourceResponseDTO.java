package com.zenith.webapp.facility.dto.response;

import com.zenith.webapp.facility.enums.Type;
import com.zenith.webapp.facility.enums.Status;
import lombok.Data;

@Data
public class ResourceResponseDTO {

    // ID field is included to send back to the React frontend
    private Long id;
    private String name;
    private Type type;
    private int capacity;
    private int quantity;
    private String location;
    private String availabilityWindow;
    private Status status;

}