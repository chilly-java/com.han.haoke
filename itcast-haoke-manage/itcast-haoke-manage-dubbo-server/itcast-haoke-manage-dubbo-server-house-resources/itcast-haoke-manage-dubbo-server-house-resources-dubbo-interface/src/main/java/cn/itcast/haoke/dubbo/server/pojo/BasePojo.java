package cn.itcast.haoke.dubbo.server.pojo;

import lombok.Data;

import java.io.Serializable;
import java.util.Date;

@Data
public class BasePojo implements Serializable {
    private Date created;
    private Date updated;

}
