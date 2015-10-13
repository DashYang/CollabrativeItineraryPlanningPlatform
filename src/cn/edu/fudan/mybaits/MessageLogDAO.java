package cn.edu.fudan.mybaits;

import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.SelectKey;

/**
 * @author dash
 * @version 1.0 date 2015-7-28
 * @since JDK1.6
 */
public interface MessageLogDAO {

	@Insert("insert into messagelog (`timestamp`,`date`,`city`,`group`,`user`,`type`,`start`,`end`,`title`,`content`,`lastUpdateId`,`receiveTime`)"
			+ " values (#{timestamp},#{date},#{city},#{group},#{user},#{type},#{start},#{end},#{title},#{content},#{lastUpdateId},#{receiveTime})")
	@SelectKey(before = false, keyProperty = "id",statement = { "SELECT last_insert_id() as id" }, resultType = java.lang.Integer.class)
	public int insert(MessageLog messageLog);
	
	@Select("select * from messagelog")
	public List<MessageLog> getList();
	
	@Select("select * from messagelog where `user` = #{user} and `type` = #{type}")
	public List<MessageLog> getMessageByUserAndType(@Param(value="user") String user ,@Param(value="type") String type);
	
	@Select("select * from messagelog where `date` = #{date} and `city` = #{city} and `group` = #{group}")
	public List<MessageLog> getMessageByMapInfo(@Param(value="date") String date ,@Param(value="city") String city , @Param(value="group") String group);
}
