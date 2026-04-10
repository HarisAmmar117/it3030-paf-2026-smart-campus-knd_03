package com.zenith.webapp.facility.dto.request;

import com.zenith.webapp.facility.enums.Type;
import com.zenith.webapp.facility.enums.Status;
import lombok.Data;

@Data
public class ResourceRequestDTO {

    // No ID field because the database generates it
    private String name;
    private Type type;
    private int capacity;
    private int quantity;
    private String location;
    private String availabilityWindow;
    private Status status;

}