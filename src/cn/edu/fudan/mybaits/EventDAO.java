package cn.edu.fudan.mybaits;

import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Select;

/**
 * @author dash
 * @version 1.0 date 2015-7-20
 * @since JDK1.6
 */
public interface EventDAO {
	@Insert("insert into events (`username`,`groupId`,`startDate`,`endDate`,`city`,`event`,`user_status`,`event_status`)"
			+ " values (#{username},#{groupId},#{startDate},#{endDate},#{city},#{event},#{user_status},#{event_status})")
	public int insert(Event event);
	
	@Select("select * from events")
	public List<Event> getList();
}
