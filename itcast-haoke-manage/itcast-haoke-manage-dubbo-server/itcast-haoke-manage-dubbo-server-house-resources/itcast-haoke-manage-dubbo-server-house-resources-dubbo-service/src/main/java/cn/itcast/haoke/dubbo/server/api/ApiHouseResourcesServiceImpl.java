package cn.itcast.haoke.dubbo.server.api;

import cn.itcast.haoke.dubbo.server.pojo.HouseResources;
import cn.itcast.haoke.dubbo.server.service.HouseResourcesService;
import com.alibaba.dubbo.config.annotation.Service;
import org.springframework.beans.factory.annotation.Autowired;

@Service(version = "1.0.0") // 这是dubbo服务，对外进行暴露
public class ApiHouseResourcesServiceImpl implements ApiHouseResourcesService {
    @Autowired
    private HouseResourcesService houseResourcesService;
    @Override
    public int saveHouseResources(HouseResources houseResources) {
        return this.houseResourcesService.saveHouseResources(houseResources);
    }

}
